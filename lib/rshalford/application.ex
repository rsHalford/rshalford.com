defmodule RSHalford.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      RSHalfordWeb.Telemetry,
      RSHalford.Repo,
      {DNSCluster, query: Application.get_env(:rshalford, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: RSHalford.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: RSHalford.Finch},
      # Start a worker by calling: RSHalford.Worker.start_link(arg)
      # {RSHalford.Worker, arg},
      # Start to serve requests, typically the last entry
      RSHalfordWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: RSHalford.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    RSHalfordWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
