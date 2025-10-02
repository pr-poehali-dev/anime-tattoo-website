'''
Business: Управление заказами - создание, просмотр, обновление статуса и цены
Args: event с httpMethod, body, queryStringParameters, headers (X-User-Id)
Returns: HTTP response с данными заказа или списком заказов
'''

import json
import os
from typing import Dict, Any, Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            cur.execute(f"SELECT role FROM t_p57800500_anime_tattoo_website.users WHERE id = {user_id}")
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пользователь не найден'})
                }
            
            params = event.get('queryStringParameters', {})
            order_id = params.get('id')
            
            if order_id:
                cur.execute(f"""
                    SELECT o.*, u.name as client_name, u.email as client_email 
                    FROM t_p57800500_anime_tattoo_website.orders o
                    JOIN t_p57800500_anime_tattoo_website.users u ON o.user_id = u.id
                    WHERE o.id = {order_id}
                """)
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
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(order), default=str)
                }
            else:
                if user['role'] == 'master':
                    cur.execute("""
                        SELECT o.*, u.name as client_name, u.email as client_email 
                        FROM t_p57800500_anime_tattoo_website.orders o
                        JOIN t_p57800500_anime_tattoo_website.users u ON o.user_id = u.id
                        ORDER BY o.created_at DESC
                    """)
                else:
                    cur.execute(f"""
                        SELECT o.*, u.name as client_name, u.email as client_email 
                        FROM t_p57800500_anime_tattoo_website.orders o
                        JOIN t_p57800500_anime_tattoo_website.users u ON o.user_id = u.id
                        WHERE o.user_id = {user_id}
                        ORDER BY o.created_at DESC
                    """)
                
                orders = cur.fetchall()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(o) for o in orders], default=str)
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            service_type = body_data.get('service_type', '').replace("'", "''")
            description = body_data.get('description', '').replace("'", "''")
            
            if not service_type:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не указан тип услуги'})
                }
            
            cur.execute(f"""
                INSERT INTO t_p57800500_anime_tattoo_website.orders 
                (user_id, service_type, description, status)
                VALUES ({user_id}, '{service_type}', '{description}', 'pending')
                RETURNING id, user_id, service_type, description, status, price, payment_method, created_at, updated_at
            """)
            order = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(order), default=str)
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            order_id = body_data.get('order_id')
            
            if not order_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не указан ID заказа'})
                }
            
            cur.execute(f"SELECT role FROM t_p57800500_anime_tattoo_website.users WHERE id = {user_id}")
            user = cur.fetchone()
            
            cur.execute(f"SELECT * FROM t_p57800500_anime_tattoo_website.orders WHERE id = {order_id}")
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
            
            updates = []
            
            if 'status' in body_data:
                status = body_data['status'].replace("'", "''")
                updates.append(f"status = '{status}'")
            
            if 'price' in body_data and user['role'] == 'master':
                price = body_data['price']
                updates.append(f"price = {price}")
                if 'status' not in body_data:
                    updates.append("status = 'priced'")
            
            if 'payment_method' in body_data:
                payment_method = body_data['payment_method'].replace("'", "''")
                updates.append(f"payment_method = '{payment_method}'")
            
            if updates:
                updates.append("updated_at = CURRENT_TIMESTAMP")
                update_str = ', '.join(updates)
                
                cur.execute(f"""
                    UPDATE t_p57800500_anime_tattoo_website.orders 
                    SET {update_str}
                    WHERE id = {order_id}
                    RETURNING id, user_id, service_type, description, status, price, payment_method, created_at, updated_at
                """)
                updated_order = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(updated_order), default=str)
                }
            
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Нет данных для обновления'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    finally:
        cur.close()
        conn.close()
