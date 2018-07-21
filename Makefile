shared_local:
	cd assets && yarn build && cd ..
	mix phx.digest
	PORT=4000 MIX_ENV=prod mix phx.server
