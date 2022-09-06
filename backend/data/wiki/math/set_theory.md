# Set theory

# Relations

A relation is injective if any $y$ belongs only to one $x$ - if at all.
> **Definition** 
    Injective (1-1): $\forall x_1, x_2 \in X: x_1 R y_0 \land x_2 R y_0 \rightarrow x_1 = x_2$


A relation is surjective if any $y$ belongs to at least one $x$.
> **Definition** 
    Surjective (onto): $\forall y \in Y: \exists x \in X: x R y$


Note that none of the above definitions means that there is a $y$ for any $x$. Under both definitions, there can be $X$'s that have none or more than one $y$. 

While these definitions are useful, it is sometimes easier to use the following definitions based on the number of in- or outgoing arrows:

\begin{table}[h]
\centering
\caption{Types of binary relations}
\begin{tabular}{@{}lll@{}}
\toprule
               & out      & in         \\ \midrule
$\leq$ 1       & function & injective (1-1) \\
$\geq$ 1       & total    & surjective (onto) \\ \bottomrule
\end{tabular}
\end{table}


    - function: \# out $\leq$ 1
    - injective: \# in $\leq$ 1
    - total: \# out $\geq$ 1
    - surjective: \# in $\geq$ 1
    - bijective: \# out = \# in = 1


> **Theorem**
 Let $R$ be a relation on $ A \times B$. Then: 
 $ R:injective \land R:function \then  |A| \leq |B|$
\end{theorem}
\begin{proof}
    \subprf{Suppose that R:injective and  R:function.}{$|A| \leq |B|$}{
        $R$:injective, thus: \# edges $\leq |B|$ \\
        $R$:function, thus:  $|A| \leq $ \# edges \\
        Thus $|A| \leq $ \# edges $\leq |B|$
    }
\end{proof}

> **Theorem**
 Let $R$ be a relation on $ A \times B$. Then: 
 $ R:surjective \land R:total \then  |A| \geq |B|$
\end{theorem}

> **Theorem**
 Let $R$ be a relation on $ A \times B$. Then: 
 $ R:bijective \then  |A| = |B|$
\end{theorem}

The combination of function and surjectivity is sometimes written as A surj B; the combination of totlity and injectivity as A inj B. 

This begs a question: $\lnot A surj B \iff A inj B $ ? 
No, this doesn't hold. A counterexample would be ...
But we can proof that $A surj B \iff B inj A$:

# Orders

> **Definition** 
    Partial order: A relation R on a set S is called a partial order if it is reflexive, antisymmetric and transitive.
    
        - reflexive: $\forall x \in S: xRx$
        - antisymetric: $\forall x,y \in S: xRy \land yRx \then x=y$
        - transitive: $\forall x,y,z \in S: xRy \land yRz \then xRz$
    


> **Definition** 
    Total order: a relation R on a set S is called a total order if it is a partial order and also comparable
    
        - comparable, a.k.a. total: $\forall a,b \in S: aRb \lor bRa$
    


> **Definition** 
    Topological order


> **Definition** 
     Closure: 
     
     A set S and a binary operator * are said to exhibit closure if applying the binary operator to two elements S returns a value which is itself a member of S.

    The closure of a set A is the smallest closed set containing A. Closed sets are closed under arbitrary intersection, so it is also the intersection of all closed sets containing A. Typically, it is just A with all of its accumulation points. 



# Partitions

# Recursion


