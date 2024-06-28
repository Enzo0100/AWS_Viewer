import boto3

def get_boto3_client(service):
    try:
        client = boto3.client(service)
        return client
    except Exception as e:
        print(f"Error creating Boto3 client for {service}: {e}")
        return None
