defmodule AudioengineWeb.ClockControllerTest do
  use AudioengineWeb.ConnCase

  test "GET /api/clock", %{conn: conn} do
    conn = get conn, "/api/clock"
    assert json_response(conn, 200) == %{
      "time" => Audioengine.Core.Clock.get_time(),
      "interval" => Audioengine.Core.Clock.get_interval()
    }
  end
end
