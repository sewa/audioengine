defmodule AudioengineWeb.Router do
  use AudioengineWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", AudioengineWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  scope "/api", AudioengineWeb do
    pipe_through :api

    get "/session", SessionController, :show
    get "/clock", ClockController, :clock
    post "/timesync", ClockController, :timesync
  end
end
