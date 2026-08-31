import quickjs

try:
    with open("db.js", "r", encoding="utf-8") as f:
        db_js = f.read()
    with open("script.js", "r", encoding="utf-8") as f:
        script_js = f.read()
    
    ctx = quickjs.Context()
    
    # Mocking standard browser objects so it doesn't crash on document.addEventListener
    mock_env = """
    var window = {};
    var document = {
        addEventListener: function() {},
        getElementById: function() { return {}; },
        querySelector: function() { return {}; },
        querySelectorAll: function() { return []; },
        body: { classList: { remove: function() {} } }
    };
    var localStorage = {
        getItem: function() { return null; },
        setItem: function() { return null; },
        removeItem: function() { return null; }
    };
    """
    
    print("Evaluating mock_env...")
    ctx.eval(mock_env)
    print("Evaluating db.js...")
    ctx.eval(db_js)
    print("Evaluating script.js...")
    ctx.eval(script_js)
    
    print("Evaluated successfully!")
except Exception as e:
    print("Error during JS evaluation:")
    print(e)