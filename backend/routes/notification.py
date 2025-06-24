# backend/routes/notification.py (Archivo nuevo)

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from models.modelo import session, User, Notification, InputNotification
from auth.security import Security
from sqlalchemy import desc

notification = APIRouter()

# Dependencia para obtener el usuario actual a partir del token
def get_current_user(req: Request):
    token_data = Security.verify_token(req.headers)
    if "username" not in token_data:
        raise HTTPException(status_code=401, detail="Invalid token or user not found")
    
    user = session.query(User).filter(User.username == token_data["username"]).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@notification.post("/notifications/send")
def send_notification(notification_data: InputNotification, req: Request, current_user: User = Depends(get_current_user)):
    # Solo los administradores pueden enviar notificaciones
    if current_user.userdetail.type != 'administrador':
        return JSONResponse(status_code=403, content={"message": "Permission denied"})
    
    # Verificar que el usuario destinatario existe
    recipient = session.query(User).filter(User.id == notification_data.id_user).first()
    if not recipient:
        return JSONResponse(status_code=404, content={"message": "Recipient user not found"})

    new_notif = Notification(id_user=notification_data.id_user, message=notification_data.message)
    session.add(new_notif)
    session.commit()
    
    return {"message": "Notification sent successfully"}

@notification.get("/notifications/my")
def get_my_notifications(current_user: User = Depends(get_current_user)):
    notifications = session.query(Notification).filter(Notification.id_user == current_user.id).order_by(desc(Notification.created_at)).all()
    
    return [{"id": n.id, "message": n.message, "is_read": n.is_read, "created_at": n.created_at} for n in notifications]

@notification.post("/notifications/{notification_id}/mark-as-read")
def mark_as_read(notification_id: int, current_user: User = Depends(get_current_user)):
    notif = session.query(Notification).filter(Notification.id == notification_id).first()

    if not notif:
        return JSONResponse(status_code=404, content={"message": "Notification not found"})
    
    # Asegurarse de que el usuario solo pueda marcar sus propias notificaciones
    if notif.id_user != current_user.id:
        return JSONResponse(status_code=403, content={"message": "Permission denied"})

    notif.is_read = True
    session.commit()
    
    return {"message": "Notification marked as read"}