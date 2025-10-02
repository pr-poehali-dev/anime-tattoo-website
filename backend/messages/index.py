'''
Business: Чат в заказах - отправка и получение сообщений между клиентом и мастером
Args: event с httpMethod, body, queryStringParameters, headers (X-User-Id)
Returns: HTTP response с сообщениями или подтверждением отправки
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Требуется авторизация'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            order_id = params.get('order_id')
            
            if not order_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не указан ID заказа'})
                }
            
            cur.execute(f"SELECT role FROM t_p57800500_anime_tattoo_website.users WHERE id = {user_id}")
            user = cur.fetchone()
            
            cur.execute(f"SELECT user_id FROM t_p57800500_anime_tattoo_website.orders WHERE id = {order_id}")
            order = cur.fetchone()
            
            if not order:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заказ не найден'})
                }
            
            if user['role'] != 'master' and order['user_id'] != int(user_id):
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Доступ запрещен'})
                }
            
            cur.execute(f"""
                SELECT m.*, u.name as sender_name, u.role as sender_role
                FROM t_p57800500_anime_tattoo_website.order_messages m
                JOIN t_p57800500_anime_tattoo_website.users u ON m.sender_id = u.id
                WHERE m.order_id = {order_id}
                ORDER BY m.created_at ASC
            """)
            messages = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(m) for m in messages], default=str)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            order_id = body_data.get('order_id')
            message = body_data.get('message', '').replace("'", "''")
            
            if not order_id or not message:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не указан ID заказа или текст сообщения'})
                }
            
            cur.execute(f"SELECT role FROM t_p57800500_anime_tattoo_website.users WHERE id = {user_id}")
            user = cur.fetchone()
            
            cur.execute(f"SELECT user_id, status FROM t_p57800500_anime_tattoo_website.orders WHERE id = {order_id}")
            order = cur.fetchone()
            
            if not order:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заказ не найден'})
                }
            
            if user['role'] != 'master' and order['user_id'] != int(user_id):
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Доступ запрещен'})
                }
            
            cur.execute(f"""
                INSERT INTO t_p57800500_anime_tattoo_website.order_messages 
                (order_id, sender_id, message)
                VALUES ({order_id}, {user_id}, '{message}')
                RETURNING id, order_id, sender_id, message, created_at
            """)
            new_message = cur.fetchone()
            
            if order['status'] == 'pending':
                cur.execute(f"""
                    UPDATE t_p57800500_anime_tattoo_website.orders 
                    SET status = 'discussing', updated_at = CURRENT_TIMESTAMP
                    WHERE id = {order_id}
                """)
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_message), default=str)
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    finally:
        cur.close()
        conn.close()
