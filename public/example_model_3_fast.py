def check_soluiton(input_df_name):
    import pandas as pd
    df = pd.read_csv(input_df_name)
    df['predictions'] = 0
    df.to_csv('predict_submission.csv')
    