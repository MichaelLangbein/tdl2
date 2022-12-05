# Wikidata


## Web client
https://query.wikidata.org/

### SparQL
https://www.wikidata.org/wiki/Wikidata:SPARQL_tutorial

```SQL
SELECT ?child ?childLabel
WHERE
{
# ?child  father   Bach
  ?child wdt:P22 wd:Q1339.

# add this line to return text-representations of the result-codes
# this automatically adds a `?<variableName>Label` variable value
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
}
```


- **Variables** start with a `?`
- `where` contains restrictions on variables
    - usually in the form of **triplets**
    - all data in wikidata is stored in the form of triplets
- **triplets**: 
    - subject / predicate / object
        - subjects and objects are so called *items*, predicates are called *relations*
- **relations**
    - most predicates are of the `has` kind, not the `is` kind (ie: ?fruit color yellow) (important for predicates like `parent` or `child`)
    - if predicates are of the `is` kind, there are two cases:
        - `instance of` (`wdt:P31`)
        - `subclass of` (`wdt:P279`)
- **Values** are not human-readable, but encoded
    - **codes** for values can be searched for [here](https://www.wikidata.org/wiki/Special:Search)
    - codes for predicates in particular can be found on the same site, but with a `P:<searchterm>` prefix
    - item-codes begin with `wd:<id>`, relation-codes with `wdt:<id>`
    - in the web-client, you can get suggestions for codes with `wd:<your search term>CTRL + SPACE` for items or `wdt:<your search term>CTRL + SPACE` for relations.

#### **Anonymous variables**
```sql
SELECT ?grandChild
WHERE {
  wd:Q1339 wdt:P40 ?child.
  ?child   wdt:P40 ?grandChild.
}
# is analogous to:
SELECT ?grandChild
WHERE {
  wd:Q1339 wdt:P40 [ wdt:P40 ?grandChild ].
}
```

#### **Instanceof and subclassof** as property-paths
Subclasses can be arbitrarily deeply nested.
Solution: `?item wdt:P31/wdt:P279* ?class` === one instance-of and arbitrarily many subclass-of relations.
```sql
SELECT ?work ?workLabel
WHERE
{
  ?work wdt:P31/wdt:P279* wd:Q838948. # instance of any subclass of work of art
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE]". }
}
```


This is a special case of a **property-path**. You can add path elements with a forward slash (/).
```sql
?item wdt:P31/wdt:P279/wdt:P279 ?class.
```


#### **Qualifiers**



## Python client

```python
from wikidata.client import Client
client = Client()
entity = client.get('Q20145', load=True)
```