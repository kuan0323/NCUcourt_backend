source .env.production

sudo docker build -t ncu-court-backend .
sudo docker 2>/dev/null stop ncu-court-backend-container | true
sudo docker 2>/dev/null rm ncu-court-backend-container | true
sudo docker run -d -p 3005:3005 --name ncu-court-backend-container ncu-court-backend
sudo docker 2>/dev/null rmi `sudo docker images --filter dangling=true -q` | true
