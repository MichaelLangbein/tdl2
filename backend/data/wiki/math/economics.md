# Economics

## Value, consumer-surplus and demand

- $v(q)$: **marginal value**, i.e. $\frac{\partial \text{happyness}}{\partial q}$
- $cs(q) | p$: **consumer surplus**, defined as $cs(q) | p = \int^{q}v d q - pq$
- $\frac{\partial cs}{\partial q_0} = 0 \to v(q_0) = p$
- $q_0 = v^{-1}(p)$, we call $v^{-1}(p)$ the **demand** $q^{demand}(p)$.


Corollaries
- Increase in usefulness of any one unit: curve moves up
- More units demanded: curve moves right


Special cases:
- *Normal* goods: higher income leads to higher demand
- *Inferior* goods: higher income doesn't lead to higher demand
- *Complementary* goods: higher consumption of *A* leads to higher demand for *B*
    - Example: use of computers increases demand for printers.
- *Substitute* goods
    - Example: cola and pepsi

## Cost, producer-surplus (aka. profit) and supply

- $c(q)$: **marginal costs**, i.e. $\frac{\partial \text{total production costs}}{\partial q}$
- $ps(q) | p$: **producer surplus**, aka. profit, defined as $ps(q) | p = pq - \int^{q}c d q$
- $\frac{\partial ps}{\partial q_0} = 0 \to  p = c(q_0)$
- $c^{-1}(p) = q_0$, we call $c^{-1}$ the **supply** $q^{supply}(p)$.


## Markets

In a free market, we have $p: q^{supply}(p) = q^{demand}(p)$
>
> *Proof*: By contradiction
>
>> *Case 1*: assume that $p: q^{supply}(p) < q^{demand}(p)$
>>
>> This is a market of shortage. $q$ is determined by the producers: producers will be able to produce a quantity such that their producer-surplus is maximal ... whereas the consumer-surplus might not be.
>>
>> |               | $p$                                              | $p + \delta$                                      |
>> |---------------|--------------------------------------------------|---------------------------------------------------|
>> | $q^{supply}$  | optimal: $c^{-1}(p) := q^{supply}_p$             | optimal: $c^{-1}(p + \delta) := q^{supply}_{p + \delta}$   |
>> | $cs(q)\|p$    | $\int^{q^{supply}_p} v dq - pq^{supply}_p$       | $\int^{q^{supply}_{p + \delta}} v dq - (p + \delta)q^{supply}_{p + \delta}$ |
>>
>> $$ \begin{aligned}
            cs(q)|p+\delta - cs(q)|p &= \int^{q^{supply}_{p + \delta}} v dq - (p + \delta)q^{supply}_{p + \delta} - \int^{q^{supply}_p} v dq + pq^{supply}_p                                                                             \\
            &= \int_{q^{supply}_p}^{q^{supply}_{p+\delta}} v dq - p \frac{\partial q^{supply}}{\partial p}\partial p - \delta q_{p+\delta}^{supply}  \\
            &= v(q^{supply}_{p+\delta}) \partial q^{supply} - p \partial q^{supply} - \delta  q^{supply}_{p+\delta}   \\
            &\approx v(q) \partial q - p \partial q 
    \end{aligned} $$
>> Since this is a shortage-market, we have $v(q) > p$, thus the change in $cs$ will always be positive.
>>
>> We see that the consumer-surplus is higher even if the price increases, so consumers will tollerate a price-hike.
>
>> *Case 2*: assume that $p: q^{supply}(p) > q^{demand}(p)$
>>
>> This is a market of over-supply. $q$ is determined by the consumers: they will be able to consume a quantity such that their consumer-surplus is maximal ... whereas the producer-surplus might not be.
>>
>> |               | $p$               | $p - \delta$             | 
>> |---------------|-------------------|--------------------------|
>> | $q^{demand}$  |                   |                          |
>> | $ps(q)\|p$    |                   |                          |
>>
>> We see that the producer-surplus increases even if the price decreases, so producers will tollerate a drop in prices.


