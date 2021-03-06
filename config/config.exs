# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :meeting_server, MeetingServerWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "wUa7W41TY0tH3VLGumSdCJk0Vuw3I/TRnU+mGvlLqbJxsDNJ5CILMBK8OA03gfR/",
  render_errors: [view: MeetingServerWeb.ErrorView, accepts: ~w(html json)],
  pubsub_server: MeetingServer.PubSub

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason
