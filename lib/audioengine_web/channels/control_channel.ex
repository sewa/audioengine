defmodule AudioengineWeb.ControlChannel do
  use Phoenix.Channel

  def join("channel:control", _message, socket) do
    {:ok, socket}
  end

  # def join("channel:" <> _private_room_id, _params, _socket) do
  #   {:error, %{reason: "unauthorized"}}
  # end

  def handle_in("update", %{"body" => body}, socket) do
    broadcast! socket, "update", %{body: body}
    {:noreply, socket}
  end
end
