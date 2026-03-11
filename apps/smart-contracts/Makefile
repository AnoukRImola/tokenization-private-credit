# Ejecuta build por defecto
default: build
# Alias para test
all: test
# Test
test: build
	cargo test
# Build del contrato
build:
	stellar contract build

# Install de todos los contratos (solo sube el WASM, retorna el hash)
install: build install-escrow install-participation-token install-vault install-soroban-token

# Install escrow
install-escrow: build
	stellar contract install \
		--wasm target/wasm32v1-none/release/escrow.wasm \
		--source zkCaleb \
		--network testnet

# Install participation_token
install-participation-token: build
	stellar contract install \
		--wasm target/wasm32v1-none/release/participation_token.wasm \
		--source zkCaleb \
		--network testnet

# Install vault_contract
install-vault: build
	stellar contract install \
		--wasm target/wasm32v1-none/release/vault_contract.wasm \
		--source zkCaleb \
		--network testnet

# Install soroban_token_contract
install-soroban-token: build
	stellar contract install \
		--wasm target/wasm32v1-none/release/soroban_token_contract.wasm \
		--source zkCaleb \
		--network testnet

# Deploy individual
deploy-participation-token: build
	stellar contract deploy \
		--wasm target/wasm32v1-none/release/participation_token.wasm \
		--source zkCaleb \
		--network testnet \
		--alias participation_token \
		-- \
		--escrow_contract $(ESCROW_CONTRACT)

# Deploy vault_contract
deploy-vault: build
	stellar contract deploy \
		--wasm target/wasm32v1-none/release/vault_contract.wasm \
		--source zkCaleb \
		--network testnet \
		--alias vault_contract \
		-- \
		--admin zkCaleb

# Deploy soroban_token_contract
deploy-soroban-token: build
	stellar contract deploy \
		--wasm target/wasm32v1-none/release/soroban_token_contract.wasm \
		--source zkCaleb \
		--network testnet \
		--alias soroban_token_contract \
		-- \
		--admin zkCaleb

# Formatea el código
fmt:
	cargo fmt --all
# Limpia el proyecto
clean:
	cargo clean