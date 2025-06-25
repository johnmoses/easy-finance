class MCPManager:
    def __init__(self):
        self.context_registry = {}

    def register_context(self, context_id, context_data):
        self.context_registry[context_id] = context_data

    def get_context(self, context_id):
        return self.context_registry.get(context_id, "")

    def update_context(self, context_id, new_data):
        if context_id in self.context_registry:
            self.context_registry[context_id] += f"\n{new_data}"
