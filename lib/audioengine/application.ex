defmodule Audioengine.Application do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec

    children = [
      supervisor(AudioengineWeb.Endpoint, []),
      worker(Audioengine.Core.Clock, []),
      worker(Audioengine.Core.Session, [])
    ]

    opts = [strategy: :one_for_one, name: Audioengine.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    AudioengineWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
