import pandas as pd
import os

current_cwd = os.getcwd()
os.chdir( current_cwd + "\\src\\stores\\utils")

df = pd.read_excel("density_DB_v2_0_final-1__1_.xlsx", sheet_name="Density DB")
df = df.drop(['BiblioID','Update Version 2.0'],axis=1)
df = df.rename(columns={'Density in g/ml (including mass and bulk density)': "Density(g/ml)", 'Food name and description': 'Name'})
df["Density(g/ml)"].ffill(inplace=True)
df = df.drop(["Specific gravity"],axis=1)

def mod_range_density_to_avg(data):
    if type(data) == str and "-" in data:
        data = data.split("-")
        data = (float(data[0]) + float(data[1]))/2
    else:
        data = float(data)
    return data

df["Density(g/ml)"] = df["Density(g/ml)"].apply(mod_range_density_to_avg)
df['Name'] = df['Name'].astype(str)
df = df.dropna()

df = df.set_index("Name").to_dict()['Density(g/ml)']
import json
json_data = json.dumps(df)
with open("density.json", "w") as f:
    f.write(json_data)
