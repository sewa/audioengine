defmodule AudioengineWeb.SessionController do
  use AudioengineWeb, :controller

  def show(conn, params) do
    render conn, "show.json", state: Audioengine.Core.Session.get()
  end
end
