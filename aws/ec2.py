from .utils import get_boto3_client
from flask import current_app as app

def describe_vpcs():
    ec2 = get_boto3_client('ec2')
    if ec2 is None:
        app.logger.error("Failed to create EC2 client.")
        return []
    try:
        vpcs = ec2.describe_vpcs()['Vpcs']
        for vpc in vpcs:
            vpc['VpcName'] = get_vpc_name(vpc)
        app.logger.info(f"VPCs: {vpcs}")
        return vpcs
    except Exception as e:
        app.logger.error(f"Error describing VPCs: {e}")
        return []

def get_vpc_name(vpc):
    if 'Tags' in vpc:
        for tag in vpc['Tags']:
            if tag['Key'] == 'Name':
                return tag['Value']
    return vpc['VpcId']
    
def describe_subnets():
    ec2 = get_boto3_client('ec2')
    if ec2 is None:
        app.logger.error("Failed to create EC2 client.")
        return []
    try:
        subnets = ec2.describe_subnets()['Subnets']
        app.logger.info(f"Subnets: {subnets}")
        return subnets
    except Exception as e:
        app.logger.error(f"Error describing subnets: {e}")
        return []

def describe_ec2_instances():
    ec2 = get_boto3_client('ec2')
    if ec2 is None:
        app.logger.error("Failed to create EC2 client.")
        return []
    try:
        instances = ec2.describe_instances()['Reservations']
        ec2_instances = [instance for reservation in instances for instance in reservation['Instances']]
        app.logger.info(f"EC2 Instances: {ec2_instances}")
        return ec2_instances
    except Exception as e:
        app.logger.error(f"Error describing EC2 instances: {e}")
        return []
