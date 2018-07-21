defmodule AudioengineWeb.ClockController do
  use AudioengineWeb, :controller

  def timesync(conn, params) do
    render conn, "index.json", state: %{
      id: Map.get(params, "id"),
      result: DateTime.utc_now |> DateTime.to_unix(:millisecond),
    }
  end

  def clock(conn, _params) do
    render conn, "index.json", state: Audioengine.Core.Clock.get()
  end
end
