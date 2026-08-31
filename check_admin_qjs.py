import quickjs

try:
    with open("admin.js", "r", encoding="utf-8") as f:
        admin_js = f.read()
    
    ctx = quickjs.Context()
    
    # Mock
    mock_env = """
    var window = { location: { href: "" } };
    var document = {
        addEventListener: function() {},
        getElementById: function() { return { addEventListener: function(){} }; },
        querySelector: function() { return { addEventListener: function(){} }; },
        querySelectorAll: function() { return []; },
        body: { classList: { remove: function() {} } }
    };
    var localStorage = {
        getItem: function() { return null; },
        setItem: function() { return null; },
        removeItem: function() { return null; }
    };
    var DBHits = {
        getActiveUser: function() { return { role: "admin" }; },
        getClubConfig: function() { return {}; }
    };
    window.DBHits = DBHits;
    """
    
    ctx.eval(mock_env)
    ctx.eval(admin_js)
    
    print("Evaluated admin.js successfully!")
except Exception as e:
    print("Error during JS evaluation:")
    print(e)