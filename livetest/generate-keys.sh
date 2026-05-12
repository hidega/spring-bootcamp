#!/bin/bash

DIR=$1

for key_name in keycloak-users-key keycloak-clients-key postgres-key
do 
  ssh-keygen -t ed25519 -f $key_name -q -N ""
done

openssl req -x509 -newkey ed25519 -nodes -keyout $DIR/server-tls-key.pem -out $DIR/server-tls-cert.pem -days 365 -subj "/C=US/ST=State/L=Locality/O=Organization/CN=spring-bootcamp.com"

# rm -f authorized_keys openssh-livetest-keys.tar.gz \
#      openssh-livetest-client-key openssh-livetest-server-key \
#      openssh-livetest-client-key.pub openssh-livetest-server-key.pub openssh-livetest-client-key.pub openssh-livetest-server-key.pub
# 
# set -e
# 
# ssh-keygen -t ed25519 -f openssh-livetest-client-key -q -N ""
# ssh-keygen -t ed25519 -f openssh-livetest-server-key -q -N ""
# 
# cp openssh-livetest-client-key.pub authorized_keys
# 
# tar -czvf openssh-livetest-keys.tar.gz ./*
# 
# cp -f openssh-livetest-keys.tar.gz ../server/opt/test
# cp -f openssh-livetest-keys.tar.gz ../client/opt/test
# 
# rm -f authorized_keys openssh-livetest-keys.tar.gz openssh-livetest-client-key.pub openssh-livetest-server-key openssh-livetest-client-key openssh-livetest-server-key.pub openssh-livetest-client-key.pub openssh-livetest-server-key.pub
