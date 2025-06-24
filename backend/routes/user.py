from fastapi import APIRouter, status, Request
from fastapi.responses import JSONResponse
from models.modelo import session, User, UserDetail, PivoteUserCareer, InputUser, InputLogin, InputUserAddCareer
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import IntegrityError
from auth.security import Security

user = APIRouter()


@user.get("/")
def helloUser():
    return "Hello User!!!"

@user.get("/users/all")
def obtener_usuarios(req: Request):
    has_access = Security.verify_token(req.headers)

    if "iat" not in has_access:
        return JSONResponse(
            status_code=401,
            content=has_access,
        )
    
    try:
        users_with_details = session.query(User).options(joinedload(User.userdetail)).all()
        response_data = []
        for user in users_with_details:
            user_data = {
                "id": user.id,
                "username": user.username,
            }
            if user.userdetail:
                user_data["userdetail"] = {
                    "first_name": user.userdetail.first_name,
                    "last_name": user.userdetail.last_name,
                    "dni": user.userdetail.dni,
                    "email": user.userdetail.email,
                    "type": user.userdetail.type,
                }
            response_data.append(user_data)
            
        return response_data
        
    except Exception as e:
        print(f"Error al obtener usuarios: {e}")
        return JSONResponse(
            status_code=500,
            content={"message": "Error interno al obtener los usuarios"},
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


@user.post("/users/loginUser")
def login_post(usu: InputLogin):
    try:
        # Busca al usuario y carga su información detallada
        user = session.query(User).options(joinedload(User.userdetail)).filter(User.username == usu.username).first()

        # Verifica si el usuario existe y la contraseña es correcta (comparación directa)
        if user and user.password == usu.password:
            # Si las credenciales son válidas, genera el token
            authData = Security.generate_token(user)
            
            # Asegurarse de que el usuario tenga detalles antes de devolverlos
            if not user.userdetail:
                return JSONResponse(
                    status_code=500,
                    content={"success": False, "message": "Error de datos: el usuario no tiene detalles."},
                )

            # En caso de éxito, devuelve el token y los datos del usuario.
            # La estructura de la respuesta se ajustó para que coincida con lo que el frontend espera.
            return JSONResponse(
                status_code=200, 
                content={
                    "success": True, 
                    "token": authData,
                    "user": {
                        "username": user.username,
                        "first_name": user.userdetail.first_name,
                        "role": user.userdetail.type,
                    }
                }
            )
        else:
            # Si el usuario no existe o la contraseña es incorrecta
            return JSONResponse(
                status_code=401,
                content={"success": False, "message": "Usuario y/o password incorrectos!"},
            )
    except Exception as e:
        print("Ha ocurrido un error inesperado en login_post:", e)
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Error interno del servidor"},
        )
    finally:
        session.close()


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