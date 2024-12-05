import os
import json
import random
from pathlib import Path
from transformers import AutoModelForSeq2SeqLM, AutoModel, AutoTokenizer, pipeline
from transformers import BertTokenizerFast, BertForSequenceClassification
from config.dbx import connect

# Database with connection pooling
conn = connect()
cur = conn.cursor()

def load_json_file(filename):
    with open(filename) as f:
        file=json.load(f)
    return file  

filename="ml/intents.json"
intents=load_json_file(filename)

# Load language models
BASE_DIR = Path(__file__).resolve().parent.parent.parent
base_model_path = os.path.join(BASE_DIR, "ai/Banking/bert-model")
sql_model_path = os.path.join(BASE_DIR, "ai/SQL/model-t5")
support_model_path = os.path.join(BASE_DIR, "ai/Support/model-t5")

base_model = BertForSequenceClassification.from_pretrained(
    base_model_path
)
base_tokenizer = BertTokenizerFast.from_pretrained(
    base_model_path
)
base_pipe = pipeline(
    task='sentiment-analysis',
    model=base_model, 
    tokenizer=base_tokenizer, 
    device='mps'
)
sql_model = AutoModelForSeq2SeqLM.from_pretrained(
    sql_model_path
)
sql_tokenizer = AutoTokenizer.from_pretrained(
    sql_model_path
)
support_model = AutoModelForSeq2SeqLM.from_pretrained(support_model_path)
support_tokenizer = AutoTokenizer.from_pretrained(
    support_model_path,
)


def base_response(content, sender_id, ent_vars):
    response = ''
    entity_vars = {}
    score = base_pipe(content)[0]['score']
    tag = base_pipe(content)[0]['label']

    if score < 0.8:
        response = "Don't understand!"
    else:
        label = base_model.config.label2id[base_pipe(content)[0]['label']]
        response = random.choice(intents['intents'][label]['responses'])

        # model_response, entity_vars = base_mixin.response(content, sender_id, ent_vars, tag)
        # response += model_response
    return response, entity_vars

def sql_response(query):
    prompt = "translate English to SQL: %s " % query
    features = sql_tokenizer([prompt], return_tensors='pt')
    output = sql_model.generate(
        input_ids=features['input_ids'],
        max_new_tokens=200
        )
    return sql_tokenizer.decode(output[0], skip_special_tokens=True)

def support_response(question):
    prompt = "You are a support chatbot who helps with user queries chatbot who always responds in the style of a professional. %s " % question
    features = support_tokenizer([prompt], return_tensors='pt')
    output = support_model.generate(
        input_ids=features['input_ids'],
        max_new_tokens=200
        )
    return support_tokenizer.decode(output[0], skip_special_tokens=True)
