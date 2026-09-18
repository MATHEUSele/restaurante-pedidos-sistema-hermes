# 🍽️ Hermes — Sistema de Pedidos para Restaurantes

> Sistema web para substituir papel e caneta em restaurantes familiares de pequeno e médio porte.

---

## 👥 Perfis

| Perfil | Acesso | Observação |
|--------|--------|------------|
| **DEV** | Total (todos os restaurantes) | Cadastrado manualmente pelo desenvolvedor |
| **ADM** | Restaurante próprio | Cadastrado pelo DEV |
| **Cozinha** | Fila de pedidos (só ver + pronto/cancelar) | Subcategoria do ADM |
| **Atendente** | Interface totem + agendamentos + entregas | Login via QR Code |
| **Cliente** | Pedidos remotos + agendamento | Cadastro pelo próprio site |

### Hierarquia de permissões
```
DEV → ADM → COZINHA / ATENDENTE → CLIENTE
```
- Cada nível só age sobre o nível imediatamente abaixo
- Apenas o DEV vê dados de todos os restaurantes
- Apenas o ADM aprova reembolsos (decisão financeira)

---

## 🔄 Fluxos Principais

### Pedido Presencial
```
Atendente loga (QR) → seleciona itens no totem → confirma com nome do cliente
→ fila do ADM e Cozinha atualiza → Cozinha clica PRONTO
→ barra verde aparece para o Atendente → desliza → pedido concluído
```

### Pedido Remoto (Cliente)
```
Cliente loga → monta pedido → escolhe horário → paga (QR Pix)
→ pedido entra na fila → Cozinha prepara → PRONTO
→ cliente recebe notificação no site → Atendente confirma entrega
```

### Agendamento (via Atendente)
```
Cliente liga / aparece / manda mensagem
→ Atendente cadastra: nome + itens + horário
→ pedido entra na fila no horário marcado
```

### Login Atendente / Cozinha
```
ADM (ou DEV) gera QR Code único
→ funcionário escaneia → sistema registra hora de entrada
→ ao encerrar: registra hora de saída
```

### Reembolso
```
Cliente solicita → ADM recebe notificação → ADM aprova ou nega manualmente
```

---

## 📊 Status do Pedido

```
AGENDADO → AGUARDANDO_PAGAMENTO → PAGO → EM_PREPARO → PRONTO → ENTREGUE
                                                          ↓
                                                      CANCELADO
```

---

## 🗄️ Entidades Principais

- **Restaurante** — nome, logo, cores, horários
- **Usuário** — nome, email, perfil, restaurante
- **QR Code** — token único por funcionário, com validade
- **Produto** — nome, imagem, preço, categoria (cadastrado pelo DEV)
- **Pedido** — cliente, itens, status, total, agendamento
- **Pagamento** — gateway, status, método
- **Turno** — entrada e saída por funcionário
- **Log** — todas as ações do sistema (visível só para DEV)

---

## 💳 Pagamento

- Gateway: **Stone** ou **Nubank** (a definir)
- Método: Pix via QR Code
- Pedido só confirmado após pagamento
- Reembolso: manual pelo ADM

---

## 🚀 Fases

### Fase 1 — MVP
- Autenticação por perfil (QR Code para Atendente/Cozinha)
- Workspace DEV (logs + restaurantes)
- Interface ADM (fila + cadastro de atendentes)
- Interface Cozinha (fila + pronto/cancelar)
- Interface Atendente (totem + barra deslizável)
- Pedidos presenciais em tempo real
- Cardápio por restaurante (cadastrado pelo DEV)

### Fase 2 — Cliente Remoto
- Cadastro e login de cliente
- Pedido remoto com agendamento
- Integração gateway de pagamento (Pix QR Code)
- Reembolso manual pelo ADM
- Notificação no site para cliente

### Fase 3 — Features Futuras 🔮
- Integração WhatsApp (pedidos via WA → entram no sistema)
- Notificação via WhatsApp
- Reembolso automático via gateway
- Relatórios de faturamento e produtos mais vendidos
- Programa de fidelidade para clientes

---

## ⚠️ Pontos Técnicos a Decidir

- [ ] Stack tecnológica (frontend, backend, banco de dados)
- [ ] Padrão MVC ou outro
- [ ] Tempo real: WebSockets ou Server-Sent Events
- [ ] Gateway de pagamento: Stone ou Nubank (a definir)
- [ ] Hospedagem / infraestrutura

---

*Documento vivo — atualizar conforme decisões forem tomadas.*
