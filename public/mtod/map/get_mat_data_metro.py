# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup


rm_mark = "remote-area-mark"

data = {}

with open('metro.svg', 'r', encoding="utf-8") as f:
    p = BeautifulSoup(f, 'html.parser')
    svg = p.find('svg')
    for kid in svg.children:
        if len(kid) > 1:
            key1 = kid['id']
            data[key1] = []
            for sub in kid.children:
                if sub.name is not None:
                    temp = {}
                    temp['name'] = sub.name
                    temp['class'] = sub['class'][0]
                    if sub.name == 'path':
                        temp['d'] = sub['d']
                    elif sub.name == 'polygon':
                        temp['points'] = sub['points']
                    data[key1].append(temp)

with open('map_data_metro.json', 'w', encoding="utf-8") as f:
    f.write("map_metro = {\n")
    n1 = len(data)
    key1_list = list(data.keys())
    for i in range(0, n1):
        key1 = key1_list[i]
        f.write('\t\''+key1+'\': [\n')
        n2 = len(data[key1])
        for j in range(0, n2):
            f.write('\t\t'+str(data[key1][j]))
            if j == n2-1:
                f.write('\n')
            else:
                f.write(',\n')

        if i == n1-1:
            f.write('\t]\n')
        else:
            f.write('\t],\n')

    f.write("}\r")
