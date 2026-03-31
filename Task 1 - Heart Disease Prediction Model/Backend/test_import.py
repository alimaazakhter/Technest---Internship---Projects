import traceback

try:
    import main
    print("SUCCESS")
except Exception as e:
    with open("error_log.txt", "w") as f:
        f.write("IMPORT ERROR:\n")
        f.write(traceback.format_exc())
    print("FAILED")
