from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///todos.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(200), nullable=False)
    done = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {"id": self.id, "task": self.task, "done": self.done}


@app.route("/tasks", methods=["GET"])
def get_tasks():
    search_query = request.args.get("q", "").strip()
    if search_query:
        todos = Todo.query.filter(Todo.task.ilike(f"%{search_query}%")).all()
    else:
        todos = Todo.query.all()
    return jsonify([todo.to_dict() for todo in todos])


@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    task = data.get("task")
    if not task:
        return jsonify({"error": "Task content is required"}), 400
    new_todo = Todo(task=task)
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.to_dict()), 201


@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    todo = Todo.query.get(task_id)
    if not todo:
        return jsonify({"error": "Task not found"}), 404
    data = request.get_json()
    if "task" in data:
        todo.task = data["task"]
    if "done" in data:
        todo.done = data["done"]
    db.session.commit()
    return jsonify(todo.to_dict())


@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    todo = Todo.query.get(task_id)
    if not todo:
        return jsonify({"error": "Task not found"}), 404
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"result": "Task deleted"})


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(port=5001, debug=True)
