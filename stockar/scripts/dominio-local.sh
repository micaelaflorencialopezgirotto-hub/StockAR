#!/bin/sh
# Configura http://stockar en macOS (ver docs/acceso-stockar.md):
#   1. /etc/hosts: stockar -> 127.0.0.1
#   2. pf (firewall de macOS): redirige 127.0.0.1:80 al puerto de Vite, para entrar sin ":5173".
# Necesita sudo. La regla de pf se pierde al reiniciar la Mac: volvé a correr "activar".
#
# Uso: sh scripts/dominio-local.sh activar | desactivar | estado
set -eu

PORT="${STOCKAR_PORT:-5173}"
ANCHOR="com.apple/stockar" # macOS evalúa las reglas rdr de los anchors com.apple/*
HOSTS_LINE="127.0.0.1 stockar"

hosts_ok() {
  grep -qE '^[[:space:]]*127\.0\.0\.1[[:space:]]+stockar([[:space:]]|$)' /etc/hosts
}

case "${1:-}" in
  activar)
    if hosts_ok; then
      echo "hosts: ya tiene '$HOSTS_LINE'"
    else
      echo "$HOSTS_LINE" | sudo tee -a /etc/hosts >/dev/null
      echo "hosts: agregado '$HOSTS_LINE'"
    fi
    sudo dscacheutil -flushcache
    sudo killall -HUP mDNSResponder

    echo "rdr pass on lo0 inet proto tcp from any to 127.0.0.1 port 80 -> 127.0.0.1 port $PORT" |
      sudo pfctl -a "$ANCHOR" -f - 2>/dev/null
    sudo pfctl -E 2>/dev/null >/dev/null || true
    echo "pf: 127.0.0.1:80 -> 127.0.0.1:$PORT"
    echo "Listo: abrí http://stockar/ (con npm run dev corriendo en frontend/)."
    ;;
  desactivar)
    sudo pfctl -a "$ANCHOR" -F all 2>/dev/null || true
    echo "pf: redirección quitada"
    if hosts_ok; then
      sudo sed -i '' -E '/^[[:space:]]*127\.0\.0\.1[[:space:]]+stockar[[:space:]]*$/d' /etc/hosts
      sudo dscacheutil -flushcache
      sudo killall -HUP mDNSResponder
      echo "hosts: quitada la entrada de stockar"
    fi
    ;;
  estado)
    if hosts_ok; then echo "hosts: ok (stockar -> 127.0.0.1)"; else echo "hosts: falta la entrada de stockar"; fi
    echo "pf (requiere sudo):"
    sudo pfctl -a "$ANCHOR" -s nat 2>/dev/null || echo "  sin reglas"
    ;;
  *)
    echo "Uso: sh scripts/dominio-local.sh activar | desactivar | estado" >&2
    exit 1
    ;;
esac
