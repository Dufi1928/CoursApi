import csv

def read_csv(file_path):
    data = []
    with open(file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)
    return data

def write_csv(file_path, data, fieldnames):
    with open(file_path, mode='w', encoding='utf-8', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

def find_by_id(file_path, record_id):
    data = read_csv(file_path)
    for record in data:
        if record['id'] == str(record_id):
            return record
    return None

def update_csv(file_path, record_id, updated_record):
    data = read_csv(file_path)
    updated = False
    for i, record in enumerate(data):
        if record['id'] == str(record_id):
            data[i] = updated_record
            updated = True
            break
    if updated:
        fieldnames = data[0].keys()
        write_csv(file_path, data, fieldnames)
    return updated
