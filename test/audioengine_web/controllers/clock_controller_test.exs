defmodule AudioengineWeb.ClockControllerTest do
  use AudioengineWeb.ConnCase

  test "GET /api/clock", %{conn: conn} do
    conn = get conn, "/api/clock"
    assert json_response(conn, 200) == %{
      "timestamp" => Audioengine.Core.Clock.get_timestamp(),
      "bpm" => Audioengine.Core.Clock.get_bpm()
    }
  end

  test "GET /api/timesync", %{conn: conn} do
    conn = post conn, "/api/timesync?id=0"
    result = Map.get(json_response(conn, 200), "result")
    id     = Map.get(json_response(conn, 200), "id")
    assert_in_delta result, DateTime.utc_now |> DateTime.to_unix(:millisecond), 30
    assert id == "0"
  end
end
