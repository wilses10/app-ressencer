#!/bin/bash
# =============================================================
# Script de déploiement - Recensement Bandjoun sur Kind (k8s)
# =============================================================
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🇨🇲 =================================================${NC}"
echo -e "${GREEN}   Déploiement Recensement Bandjoun → Kind           ${NC}"
echo -e "${GREEN}=================================================${NC}"

# 1. Vérification des prérequis
echo -e "\n${BLUE}[1/6] Vérification des prérequis...${NC}"
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker non installé${NC}"; exit 1; }
command -v kind >/dev/null 2>&1 || { echo -e "${RED}❌ Kind non installé. Installez-le depuis: https://kind.sigs.k8s.io/docs/user/quick-start/${NC}"; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo -e "${RED}❌ kubectl non installé${NC}"; exit 1; }
echo -e "${GREEN}✅ Tous les prérequis sont présents${NC}"

# 2. Créer le cluster Kind
echo -e "\n${BLUE}[2/6] Création du cluster Kind...${NC}"
if kind get clusters 2>/dev/null | grep -q "bandjoun-cluster"; then
  echo -e "${YELLOW}⚠️  Cluster 'bandjoun-cluster' existe déjà. Suppression et recréation...${NC}"
  kind delete cluster --name bandjoun-cluster
fi
kind create cluster --config k8s/kind-config.yaml
echo -e "${GREEN}✅ Cluster Kind créé${NC}"

# 3. Build des images Docker
echo -e "\n${BLUE}[3/6] Build des images Docker...${NC}"
echo "  → Build backend..."
docker build -t bandjoun/backend:latest ./backend
echo "  → Build frontend..."
docker build -t bandjoun/frontend:latest ./frontend
echo -e "${GREEN}✅ Images Docker construites${NC}"

# 4. Charger les images dans Kind
echo -e "\n${BLUE}[4/6] Chargement des images dans Kind...${NC}"
kind load docker-image bandjoun/backend:latest --name bandjoun-cluster
kind load docker-image bandjoun/frontend:latest --name bandjoun-cluster
echo -e "${GREEN}✅ Images chargées dans Kind${NC}"

# 5. Déployer les manifests Kubernetes
echo -e "\n${BLUE}[5/6] Déploiement Kubernetes...${NC}"
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mysql-secret.yaml
kubectl apply -f k8s/mysql-pvc.yaml
kubectl apply -f k8s/mysql-deployment.yaml

echo "  ⏳ Attente que MySQL soit prêt..."
kubectl wait --for=condition=ready pod -l app=mysql -n bandjoun --timeout=120s

kubectl apply -f k8s/backend-deployment.yaml
echo "  ⏳ Attente du backend..."
kubectl wait --for=condition=ready pod -l app=backend -n bandjoun --timeout=120s

kubectl apply -f k8s/frontend-deployment.yaml
echo "  ⏳ Attente du frontend..."
kubectl wait --for=condition=ready pod -l app=frontend -n bandjoun --timeout=60s

echo -e "${GREEN}✅ Déploiement Kubernetes terminé${NC}"

# 6. Résumé
echo -e "\n${GREEN}=================================================${NC}"
echo -e "${GREEN}🎉 Application déployée avec succès !${NC}"
echo -e "${GREEN}=================================================${NC}"
echo -e "\n📌 Accès à l'application:"
echo -e "   ${YELLOW}http://localhost:8080${NC}  → Application web"
echo -e "   ${YELLOW}http://localhost:5000/api/health${NC}  → API (si exposée)"
echo -e "\n📌 Commandes utiles:"
echo -e "   ${BLUE}kubectl get pods -n bandjoun${NC}        → État des pods"
echo -e "   ${BLUE}kubectl get services -n bandjoun${NC}    → Services"
echo -e "   ${BLUE}kubectl logs -l app=backend -n bandjoun${NC} → Logs backend"
echo -e "   ${BLUE}kind delete cluster --name bandjoun-cluster${NC} → Supprimer"
echo -e "\n🇨🇲 Vive Bandjoun ! Vive le Cameroun !\n"
