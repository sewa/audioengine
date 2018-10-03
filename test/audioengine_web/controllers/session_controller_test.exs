defmodule AudioengineWeb.SessionControllerTest do
  use AudioengineWeb.ConnCase

  test "GET /api/session", %{conn: conn} do
    conn = get conn, "/api/session"
    assert json_response(conn, 200)
  end
end
