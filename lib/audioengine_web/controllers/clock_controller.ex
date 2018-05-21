defmodule AudioengineWeb.ClockController do
  use AudioengineWeb, :controller

  def show(conn, _params) do
    render conn, "index.json", state: Audioengine.Core.Clock.get()
  end
end
