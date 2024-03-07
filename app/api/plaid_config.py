import os
import plaid
from plaid.api import plaid_api

def create_plaid_client():
    configuration = plaid.Configuration(
        host=plaid.Environment.Sandbox,
        api_key={
            'clientId': os.environ.get('PLAID_CLIENT'),
            'secret': os.environ.get('PLAID_SECRET'),
        }
    )

    api_client = plaid.ApiClient(configuration)
    return plaid_api.PlaidApi(api_client)