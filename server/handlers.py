from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
from utils.csv_handler import read_csv, find_by_id, write_csv, update_csv


class_file = '../data/class.csv'
students_file = '../data/students.csv'


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
            new_data.append(post_data)
            write_csv(class_file, new_data, ['id', 'name', 'level'])
            self.respond(201, {'message': 'Class created'})

        elif path_parts[0] == 'students':
            # Ajouter un nouvel étudiant dans students.csv
            new_data = read_csv(students_file)
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

