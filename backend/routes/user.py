from fastapi import APIRouter, status, Request
from fastapi.responses import JSONResponse
from models.modelo import session, User, UserDetail, PivoteUserCareer, InputUser, InputLogin, InputUserAddCareer
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import IntegrityError
from auth.security import Security

user = APIRouter()


@user.get("/")
### funcion helloUer documentacion
def helloUser():
    return "Hello User!!!"

@user.get("/users/all")
def obtener_usuarios(req: Request): # <- La función ahora recibe el objeto Request 
   # Llama al método para verificar el token de los encabezados 
   has_access = Security.verify_token(req.headers)
 
   # Comprueba si el token es válido buscando la clave "iat" en el payload devuelto 
   if "iat" in has_access:
       # Si el token es válido, devuelve la lista de usuarios
       usuarios = session.query(User).all()
       return usuarios
   else:
       # Si el token no es válido, devuelve un error de no autorizado 
       return JSONResponse(
           status_code=401,
           content=has_access, # Devuelve el mensaje de error de verify_token
       )
'''
@user.get("/users/all")
### funcion helloUer documentacion
def getAllUsers():
    try:
        usersWithDetail = session.query(User).options(joinedload(User.userdetail)).all()
        usuarios_con_detalle = []
        for user in usersWithDetail:
            user_con_detalle = {
                "id": user.id,
                "username": user.username,
                "password": user.password,
                "first_name": user.userdetail.first_name,
                "last_name": user.userdetail.last_name,
                "dni": user.userdetail.dni,
                "type": user.userdetail.type,
                "email": user.userdetail.email,
            }
            usuarios_con_detalle.append(user_con_detalle)
        return JSONResponse(status_code=200, content=usuarios_con_detalle)
    except Exception as ex:
        print("Error ---->> ", ex)
        return {"message": "Error al obtener los usuarios"}
'''
''' como pasar parametros por url
@user.get("/users/{us}/{pw}")
### funcion helloUer documentacion
def loginUser(us:str, pw:str):
    usu = session.query(User).filter(User.username==us).first()
    if usu is None:
        return "Usuario no encontrado!"
    if usu.password==pw: 
        return "Usuario logueado con éxito!"
    else:
        return "Contraseña incorrecta!"
'''
''' Usado anteriormente 
@user.post("/users/add")
def create_user(us: InputUser):
    try:
        newUser = User(us.username, us.password)
        newUserDetail = UserDetail(us.firstname, us.lastname, us.dni, us.type, us.email)
        newUser.userdetail = newUserDetail
        session.add(newUser)
        session.commit()
        return "Usuario creado con éxito!"
    except Exception as ex:
        session.rollback()
        print("Error ---->> ", ex)
    finally:
        session.close()
'''
''' La función create_user ha sido modificada para incluir verificaciones previas antes de intentar crear un nuevo usuario.'''
@user.post("/users/add", status_code=status.HTTP_201_CREATED)
def create_user(us: InputUser):
    # --- MODIFICACIÓN CLAVE: Verificación previa ---
    # 1. Comprobar si el username ya existe
    existing_user = session.query(User).filter(User.username == us.username).first()
    if existing_user:
        return JSONResponse(
            status_code=409,  # 409 Conflict
            content={"status": "error", "message": "Este nombre de usuario ya está en uso.", "field": "username"}
        )

    # 2. Comprobar si el email ya existe
    existing_email = session.query(UserDetail).filter(UserDetail.email == us.email).first()
    if existing_email:
        return JSONResponse(
            status_code=409,
            content={"status": "error", "message": "Este correo electrónico ya está registrado.", "field": "email"}
        )

    # 3. Comprobar si el DNI ya existe
    existing_dni = session.query(UserDetail).filter(UserDetail.dni == us.dni).first()
    if existing_dni:
        return JSONResponse(
            status_code=409,
            content={"status": "error", "message": "Este DNI ya está registrado.", "field": "dni"}
        )

    # Si todas las verificaciones pasan, intentamos crear el usuario
    try:
        # Aquí puedes añadir el hashing de contraseña que vimos antes
        newUser = User(us.username, us.password)
        newUserDetail = UserDetail(us.firstname, us.lastname, us.dni, us.type, us.email)
        newUser.userdetail = newUserDetail
        
        session.add(newUser)
        session.commit()
        
        return {"status": "success", "message": "Usuario creado con éxito!"}

    except IntegrityError: # Captura errores de base de datos más específicos si algo se nos escapó
        session.rollback()
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Ocurrió un error inesperado al guardar los datos."}
        )
    finally:
        session.close()
       
@user.post("/users/loginUser")
def login_post(userIn: InputLogin): 
   try:
       # Busca al usuario en la base de datos 
       user = session.query(User).filter(User.username == userIn.username).first()
       
       # Verifica si el usuario existe y la contraseña es correcta 
       if not user or not user.password == userIn.password:
           return JSONResponse(
               status_code=401,
               content={"success": False, "message": "Usuario y/o password incorrectos!"},
           )
       else:
           # Si las credenciales son válidas, genera el token 
           authData = Security.generate_token(user)
           if not authData:
               # Maneja el caso en que la generación del token falle 
               return JSONResponse(
                   status_code=401,
                   content={"success": False, "message": "Error de generación de token!"},
               )
           else:
               # Devuelve el token generado al cliente 
               return JSONResponse(
                   status_code=200, 
                   content={"success": True, "token": authData}
               )
   except Exception as e:
       print(e)
       return JSONResponse(
           status_code=500,
           content={"success": False, "message": "Error interno del servidor"},
       )


## Inscribir un alumno a una carrera      
@user.post("/user/addcareer")
def addCareer(ins: InputUserAddCareer):
    try: 
        newInsc = PivoteUserCareer(ins.id_user, ins.id_career)
        session.add(newInsc)
        session.commit()
        res = f"{newInsc.user.userdetail.first_name} {newInsc.user.userdetail.last_name} fue inscripto correctamente a {newInsc.career.name}"
        print(res)
        return res
    except Exception as ex:
        session.rollback()
        print("Error al inscribir al alumno:", ex)
        import traceback
        traceback.print_exc()    
    finally:
        session.close()

@user.get("/user/career/{_username}")
def get_career_user(_username: str):
    try:
        userEncontrado = session.query(User).filter(User.username == _username ).first()
        arraySalida = []
        if(userEncontrado):
            pivoteusercareer = userEncontrado.pivoteusercareer
            for pivote in pivoteusercareer:
                career_detail = {
                    "usuario": f"{pivote.user.userdetail.first_name} {pivote.user.userdetail.last_name}",
                    "carrera": pivote.career.name,
                }
                arraySalida.append(career_detail)
            return arraySalida
        else:
            return "Usuario no encontrado!"
    except Exception as ex:
        session.rollback()
        print("Error al traer usuario y/o pagos")
    finally:
        session.close()