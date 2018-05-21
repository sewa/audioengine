defmodule AudioengineWeb.ClockControllerTest do
  use AudioengineWeb.ConnCase

  test "GET /api/clock", %{conn: conn} do
    conn = get conn, "/api/clock"
    assert json_response(conn, 200) == %{
      "timestamp" => Audioengine.Core.Clock.get_timestamp(),
      "bpm" => Audioengine.Core.Clock.get_bpm()
    }
  end
end
