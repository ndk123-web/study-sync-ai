## Local development via machine IP (no proxy)

To call the AI service directly from your browser/device on the LAN, allow your machine IP via CORS and configure the frontend:

1. In your shell before starting the AI service, set your machine IP (e.g. 192.168.0.103):

	Windows PowerShell:
	$env:DEV_MACHINE_IP = "192.168.0.103"

2. Start the AI service as usual.

3. In the frontend, create a `.env.local` with:

	VITE_AI_SERVICE_HOST=192.168.0.103
	VITE_AI_SERVICE_PORT=8000

Now requests go directly to http://192.168.0.103:8000 without any proxy.

