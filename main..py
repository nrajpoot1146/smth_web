from flask import Flask

# Create an instance of the Flask class
app = Flask(__name__)

# Use the route() decorator to tell Flask what URL should trigger the function
@app.route("/")
def hello_world():
    return "<h1>Hello, World!</h1>"

# Optional: Add another route with a variable
@app.route("/hello/<name>")
def hello_name(name):
    return f"Hello, {name}!"

# This ensures the app runs only when executed directly (not imported as a module)
if __name__ == "__main__":
    app.run(debug=True)
