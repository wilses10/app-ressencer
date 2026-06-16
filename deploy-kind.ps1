# =============================================================
# Script de déploiement PowerShell - Recensement Bandjoun
# Déploiement sur Kind (Kubernetes local)
# =============================================================

$ErrorActionPreference = "Stop"

function Write-Color($text, $color = "White") {
    Write-Host $text -ForegroundColor $color
}

Write-Color "=============================================" "Green"
Write-Color "   Recensement Bandjoun -> Deploiement Kind  " "Green"
Write-Color "   Cameroun - Region Ouest - Bandjoun        " "Green"
Write-Color "=============================================" "Green"

# 1. Vérification des prérequis
Write-Color "`n[1/6] Verification des prerequis..." "Cyan"
$missing = @()
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { $missing += "docker" }
if (-not (Get-Command kind -ErrorAction SilentlyContinue))   { $missing += "kind" }
if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) { $missing += "kubectl" }

if ($missing.Count -gt 0) {
    Write-Color "ERREUR: Outils manquants: $($missing -join ', ')" "Red"
    Write-Color "Installez-les et relancez ce script." "Yellow"
    exit 1
}
Write-Color "OK - Tous les prerequis sont presents" "Green"

# 2. Créer le cluster Kind
Write-Color "`n[2/6] Creation du cluster Kind..." "Cyan"
$clusters = kind get clusters 2>$null
if ($clusters -match "bandjoun-cluster") {
    Write-Color "Cluster existant detecte. Suppression..." "Yellow"
    kind delete cluster --name bandjoun-cluster
}
kind create cluster --config k8s/kind-config.yaml
Write-Color "OK - Cluster Kind cree" "Green"

# 3. Build des images Docker
Write-Color "`n[3/6] Build des images Docker..." "Cyan"
Write-Color "  -> Build backend..." "White"
docker build -t bandjoun/backend:latest ./backend
Write-Color "  -> Build frontend..." "White"
docker build -t bandjoun/frontend:latest ./frontend
Write-Color "OK - Images Docker construites" "Green"

# 4. Charger les images dans Kind
Write-Color "`n[4/6] Chargement des images dans Kind..." "Cyan"
kind load docker-image bandjoun/backend:latest --name bandjoun-cluster
kind load docker-image bandjoun/frontend:latest --name bandjoun-cluster
Write-Color "OK - Images chargees dans Kind" "Green"

# 5. Déployer les manifests Kubernetes
Write-Color "`n[5/6] Deploiement Kubernetes..." "Cyan"
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mysql-secret.yaml
kubectl apply -f k8s/mysql-pvc.yaml
kubectl apply -f k8s/mysql-deployment.yaml

Write-Color "  Attente que MySQL soit pret (max 2 min)..." "Yellow"
kubectl wait --for=condition=ready pod -l app=mysql -n bandjoun --timeout=120s

kubectl apply -f k8s/backend-deployment.yaml
Write-Color "  Attente du backend (max 2 min)..." "Yellow"
kubectl wait --for=condition=ready pod -l app=backend -n bandjoun --timeout=120s

kubectl apply -f k8s/frontend-deployment.yaml
Write-Color "  Attente du frontend..." "Yellow"
kubectl wait --for=condition=ready pod -l app=frontend -n bandjoun --timeout=60s

Write-Color "OK - Deploiement Kubernetes termine" "Green"

# 6. Résumé
Write-Color "`n=============================================" "Green"
Write-Color "Application deployee avec succes !" "Green"
Write-Color "=============================================" "Green"
Write-Color "`nAcces a l'application:" "White"
Write-Color "   http://localhost:8080  -> Application web" "Yellow"
Write-Color "`nCommandes utiles:" "White"
Write-Color "   kubectl get pods -n bandjoun" "Cyan"
Write-Color "   kubectl get services -n bandjoun" "Cyan"
Write-Color "   kubectl logs -l app=backend -n bandjoun" "Cyan"
Write-Color "   kind delete cluster --name bandjoun-cluster" "Cyan"
Write-Color "`nVive Bandjoun ! Vive le Cameroun !" "Green"
