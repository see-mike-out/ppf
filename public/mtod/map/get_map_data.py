# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup


rm_mark = "remote-area-mark"

data = {}

with open('regional.svg', 'r', encoding="utf-8") as f:
    p = BeautifulSoup(f, 'html.parser')
    svg = p.find('svg')
    for kid in svg.children:
        if len(kid) > 1:
            key1 = kid['id']
            data[key1] = {}
            for sub in kid.children:
                if sub.name is not None:
                    key2 = key1 + " " + sub['id']
                    if sub.name == 'path':
                        print(sub['d'])
                        data[key1][key2] = [sub['d']]
                    elif sub.name == 'g':
                        data[key1][key2] = []
                        for subsub in sub.children:
                            if subsub.name == 'path':
                                data[key1][key2].append(subsub['d'])

with open('map_data_regional.json', 'w', encoding="utf-8") as f:
    f.write("map_regional = {\n")
    n1 = len(data)
    key1_list = list(data.keys())
    for i in range(0, n1):
        key1 = key1_list[i]
        n2 = len(data[key1])
        key2_list = list(data[key1].keys())
        for j in range(0, n2):
            key2 = key2_list[j]
            if key2 == '세종특별자치시 세종시':
                f.write('\t\'세종특별자치시\': [\n')
            else:
                f.write('\t\''+key2+'\': [\n')
            n3 = len(data[key1][key2])
            for k in range(0, n3):
                f.write('\t\t\''+data[key1][key2][k])
                if k == n3-1:
                    f.write('\'\n')
                else:
                    f.write('\',\n')
            if j == n2-1:
                f.write('\t'+']\n')
            else:
                f.write('\t'+'],\n')
    f.write("}\r")
