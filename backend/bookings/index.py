'''
Business: Manage bookings - create, list, update status
Args: event with httpMethod, body (user_id, service_id, booking_date, notes)
Returns: HTTP response with booking data or list of bookings
'''

import json
import os
from typing import Dict, Any
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
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        database_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            user_id = query_params.get('user_id')
            status = query_params.get('status')
            
            query = """
                SELECT b.*, s.name as service_name, s.price, s.duration, 
                       u.name as client_name, u.email as client_email
                FROM t_p57800500_anime_tattoo_website.bookings b
                LEFT JOIN t_p57800500_anime_tattoo_website.services s ON b.service_id = s.id
                LEFT JOIN t_p57800500_anime_tattoo_website.users u ON b.user_id = u.id
                WHERE 1=1
            """
            params = []
            
            if user_id:
                query += " AND b.user_id = %s"
                params.append(int(user_id))
            
            if status:
                query += " AND b.status = %s"
                params.append(status)
            
            query += " ORDER BY b.booking_date DESC"
            
            cur.execute(query, params)
            bookings = cur.fetchall()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(b) for b in bookings], default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('user_id')
            service_id = body_data.get('service_id')
            booking_date = body_data.get('booking_date')
            notes = body_data.get('notes', '')
            
            if not all([user_id, service_id, booking_date]):
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id, service_id и booking_date обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """INSERT INTO t_p57800500_anime_tattoo_website.bookings 
                   (user_id, service_id, booking_date, notes, status) 
                   VALUES (%s, %s, %s, %s, 'pending') 
                   RETURNING id, user_id, service_id, booking_date, status, notes, created_at""",
                (user_id, service_id, booking_date, notes)
            )
            new_booking = cur.fetchone()
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_booking), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            booking_id = body_data.get('id')
            status = body_data.get('status')
            
            if not booking_id or not status:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'id и status обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """UPDATE t_p57800500_anime_tattoo_website.bookings 
                   SET status = %s 
                   WHERE id = %s 
                   RETURNING id, user_id, service_id, booking_date, status, notes, created_at""",
                (status, booking_id)
            )
            updated_booking = cur.fetchone()
            conn.commit()
            
            if not updated_booking:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Запись не найдена'}),
                    'isBase64Encoded': False
                }
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_booking), default=str),
                'isBase64Encoded': False
            }
        
        else:
            cur.close()
            conn.close()
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }
