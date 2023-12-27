from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
from utils.csv_handler import read_csv, find_by_id, write_csv, update_csv


class_file = "D:\Cours\Api-cours\data\class.csv"
students_file = "D:\Cours\Api-cours\data\students.csv"


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path_parts = parsed_path.path.strip('/').split('/')
        query_params = parse_qs(parsed_path.query)

        if path_parts[0] == 'class':
            if len(path_parts) == 2:
                # GET single class
                class_record = find_by_id(class_file, path_parts[1])
                self.respond(200 if class_record else 404, class_record)
            else:
                # GET all classes
                class_data = read_csv(class_file)
                self.respond(200, class_data)

        elif path_parts[0] == 'students':
            if len(path_parts) == 2:
                # GET single student
                student_record = find_by_id(students_file, path_parts[1])
                self.respond(200 if student_record else 404, student_record)
            else:
                # GET all students
                students_data = read_csv(students_file)
                self.respond(200, students_data)

        else:
            self.respond(404, {'message': 'Not found'})

    def respond(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        if data is not None:
            self.wfile.write(json.dumps(data).encode())

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = json.loads(self.rfile.read(content_length))

        path_parts = self.path.strip('/').split('/')

        if path_parts[0] == 'class':
            # Ajouter une nouvelle classe dans class.csv
            new_data = read_csv(class_file)

            new_id = 1
            for row in new_data:
                if int(row['id']) >= new_id:
                    new_id = int(row['id']) + 1
            post_data['id'] = str(new_id)
            new_data.append(post_data)
            write_csv(class_file, new_data, ['id', 'name', 'level'])
            self.respond(201, {'message': 'Class created'})

        elif path_parts[0] == 'students':
            # Ajouter un nouvel étudiant dans students.csv
            new_data = read_csv(students_file)

            new_id = 1
            for row in new_data:
                # Vérifier si l'ID est non vide et numérique avant de convertir
                if row['id'].isdigit() and int(row['id']) >= new_id:
                    new_id = int(row['id']) + 1
            post_data['id'] = str(new_id)

            new_data.append(post_data)
            write_csv(students_file, new_data,
                      ['id', 'lastname', 'firstname', 'email', 'phone', 'address', 'zip', 'city', 'class'])
            self.respond(201, {'message': 'Student created'})

        else:
            self.respond(404, {'message': 'Not found'})

    def do_PATCH(self):
        content_length = int(self.headers['Content-Length'])
        patch_data = json.loads(self.rfile.read(content_length))

        path_parts = self.path.strip('/').split('/')

        if path_parts[0] == 'class' and len(path_parts) == 2:
            # Modifier partiellement une classe dans class.csv
            updated = update_csv(class_file, path_parts[1], patch_data)
            message = 'Class updated' if updated else 'Class not found'
            self.respond(200 if updated else 404, {'message': message})

        elif path_parts[0] == 'students' and len(path_parts) == 2:
            # Modifier partiellement un étudiant dans students.csv
            updated = update_csv(students_file, path_parts[1], patch_data)
            message = 'Student updated' if updated else 'Student not found'
            self.respond(200 if updated else 404, {'message': message})

        else:
            self.respond(404, {'message': 'Not found'})

    def do_DELETE(self):
        path_parts = self.path.strip('/').split('/')

        if path_parts[0] == 'class' and len(path_parts) == 2:
            # Supprimer une classe dans class.csv
            class_id = path_parts[1]
            class_data = read_csv(class_file)
            class_record = find_by_id(class_file, class_id)

            if class_record:
                class_data = [record for record in class_data if record['id'] != class_id]
                write_csv(class_file, class_data, ['id', 'name', 'level'])
                self.respond(200, {'message': 'Class deleted'})
            else:
                self.respond(404, {'message': 'Class not found'})

        elif path_parts[0] == 'students' and len(path_parts) == 2:
            # Supprimer un étudiant dans students.csv
            student_id = path_parts[1]
            student_data = read_csv(students_file)
            student_record = find_by_id(students_file, student_id)

            if student_record:
                student_data = [record for record in student_data if record['id'] != student_id]
                write_csv(students_file, student_data,
                          ['id', 'lastname', 'firstname', 'email', 'phone', 'address', 'zip', 'city', 'class'])
                self.respond(200, {'message': 'Student deleted'})
            else:
                self.respond(404, {'message': 'Student not found'})

        else:
            self.respond(404, {'message': 'Not found'})
