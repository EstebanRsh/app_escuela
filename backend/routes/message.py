
from fastapi import APIRouter, status, Request, HTTPException
from typing import List
from models.modelo import session, User, Message, InputMessage, MessageResponse

from auth.security import Security

message = APIRouter()


@message.post("/messages")
def send_message(msg_input: InputMessage, req: Request):
    """
    Permite que un Administrador envíe un mensaje a otro usuario.
    - msg_input (InputMessage): Son los datos que vienen en el cuerpo de la petición (el JSON).
      FastAPI automáticamente valida que el JSON tenga 'recipient_id' y 'content'.
    - req (Request): Es la petición completa, la usamos para obtener el token de las cabeceras.
    """
    try:
        
        token_data = Security.verify_token(req.headers)
        if token_data.get("role") != "Administrador":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, # 403 Forbidden significa "Sé quién eres, pero no tienes permiso".
                detail="No tienes permiso para enviar mensajes."
            )
        
        # Si es un admin, guardamos su ID. Será el remitente (sender).
        sender_id = token_data["user_id"]

    except Exception:
       
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token inválido o expirado."
        )

    # Crear y guardar el mensaje en la Base de Datos.
    try:
        recipient = session.query(User).filter(User.id == msg_input.recipient_id).first()
        if not recipient:
            
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"El usuario destinatario con ID {msg_input.recipient_id} no existe."
            )
        
       
        new_message = Message(
            sender_id=sender_id,
            recipient_id=msg_input.recipient_id,
            content=msg_input.content
        )

        session.add(new_message) 
        session.commit() 

       
        return {"detail": "Mensaje enviado correctamente."}

    except Exception as e:
        
        session.rollback()
    
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocurrió un error interno al guardar el mensaje."
        )
    finally:
 
        session.close()


# --- RUTA PARA OBTENER LOS MENSAJES DE UN USUARIO ---

@message.get("/messages", response_model=List[MessageResponse])
def get_user_messages(req: Request):
    """
    Devuelve todos los mensajes que ha recibido el usuario que hace la petición.
    """
    
    try:
        token_data = Security.verify_token(req.headers)
        if "user_id" not in token_data:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
        
        # Obtenemos el ID del usuario que está pidiendo sus mensajes.
        user_id = token_data["user_id"] 
    
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado.")

    # Consultar sus mensajes en la Base de Datos.
    try:
        # Buscamos en la tabla 'Message' todos los registros donde el 'recipient_id' sea el nuestro.
        # Los ordenamos del más nuevo al más viejo (descendente).
        messages = session.query(Message).filter(Message.recipient_id == user_id).order_by(Message.timestamp.desc()).all()
        
        # Devolvemos la lista de mensajes. FastAPI la convertirá a JSON automáticamente.
        return messages

    finally:
        session.close()


# ---  RUTA PARA MARCAR UN MENSAJE COMO LEÍDO ---
@message.put("/messages/{message_id}/read", status_code=status.HTTP_204_NO_CONTENT)
def mark_as_read(message_id: int, req: Request):
    """
    Actualiza un mensaje para marcarlo como leído (is_read = True).
    """
    #  Verificar quién es el usuario.
    try:
        token_data = Security.verify_token(req.headers)
        user_id = token_data.get("user_id")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado.")

    #  Buscar el mensaje y actualizarlo.
    try:
        # Buscamos el mensaje específico por su ID.
        message_to_update = session.query(Message).filter(Message.id == message_id).first()

        if not message_to_update:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mensaje no encontrado.")
        
        # ¡MUY IMPORTANTE! Verificamos que el mensaje le pertenezca al usuario.
        # Esto evita que un usuario pueda marcar como leídos los mensajes de otra persona.
        if message_to_update.recipient_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permiso para modificar este mensaje.")

        # Actualizamos el campo 'is_read' a True y guardamos.
        message_to_update.is_read = True
        session.commit()

        # El código 204 significa "Todo salió bien, pero no te devuelvo ningún contenido".
        # Es perfecto para una operación como esta. FastAPI se encarga de que la respuesta vaya vacía.
        return

    finally:
        session.close()