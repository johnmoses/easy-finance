import asyncio
import requests
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("TodoMCPServer")

FLASK_API_URL = "http://localhost:5001/tasks"


# MCP tool: list tasks by calling Flask API
@mcp.tool()
async def list_todos(query: str = None):
    def fetch():
        params = {}
        if query:
            params["q"] = query  # Assuming your Flask API supports a query param 'q' for filtering
        resp = requests.get(FLASK_API_URL, params=params)
        resp.raise_for_status()
        return resp.json()

    return await asyncio.to_thread(fetch)


@mcp.tool()
async def add_todo(task: str):
    def post():
        resp = requests.post(FLASK_API_URL, json={"task": task})
        resp.raise_for_status()
        return resp.json()

    return await asyncio.to_thread(post)


# MCP tool: update a task
@mcp.tool()
def update_todo(task_id: int, task: str = None, done: bool = None):
    data = {}
    if task is not None:
        data["task"] = task
    if done is not None:
        data["done"] = done
    resp = requests.put(f"{FLASK_API_URL}/{task_id}", json=data)
    resp.raise_for_status()
    return resp.json()


# MCP tool: delete a task
@mcp.tool()
def delete_todo(task_id: int):
    resp = requests.delete(f"{FLASK_API_URL}/{task_id}")
    resp.raise_for_status()
    return {"result": "Task deleted"}

# Other tools

@mcp.tool()
def calculate(expression: str) -> str:
    """
    Evaluate a simple arithmetic expression.
    """
    import re
    if not re.match(r'^[0-9+\-*/().\s]+$', expression):
        return "Only basic arithmetic expressions are supported."
    try:
        result = eval(expression, {"__builtins__": {}})
        return f"The result is {result}."
    except Exception:
        return "Error evaluating expression."


if __name__ == "__main__":
    asyncio.run(mcp.run(transport="stdio"))
