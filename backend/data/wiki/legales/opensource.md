# Open-source licenses
Source: https://www.youtube.com/watch?v=9kGrKBOytYM 

## Legal background

Intellectual property: a "creation of the mind" that the law lets you monopolize.

### Copyright
If you invented some creative work, only you may copy and distribute it.
Given automatically to the creator ... even though possibly limited in time.
Everything that's not under copyright is public domain.

### Moral rights
Non-commercial equivalent of copyright. You must be mentioned as author.
Your work must not be defaced ... even if the work is no longer owned by you.
Might not be automatic, though; depends on country.

### Patents
Not about creative works, but functional inventions.
A deal with society: I give you the plans for my invention, and you enforce that nobody else sells it for 20 years.

### Trademarks
Sort of automatic (though registration helps). Your brand must not be imitated.





## General 
If a software has no license, you may not use it - because copyright is automatic.
Only a license can grant use & modification & distribution rights.
Putting things on github means its code you can look at ... but not that you may use it.
By using or distributing a software, you implicitly agree to the license.

Licenses can add obligations, too.
 - Attribution
 - Share-alike (copyleft)

If you don't comply with a license, you lose the rights it gave you - and there might be penalties on top of that.

## Groups
 - Permissive
    - companies have more freedom
    - Apache2, MIT, BSD, CC_A, CC_0
    - companies can use software without contributing back
    - usually requires providing attribution
    - usually author assumes no responsibility for your use
    - good if you want to spread the code as far as possible and be business-friendly
    - special case: Apache2: 
        - annoying: requires to add notices into files you changed
        - important: grant of patent license:
            - each contributor grants the user a patent-license for use of the lib
            - Anti-patent-troll-clause (mutually assured destruction: if you start a patent war, you'll loose your own patents that were based on the lib)

 - Copyleft
    - prevent users from being locked in
    - assures that users can always look at and change code
    - if your lib is based on lib_a, which has a copyleft, than your own license must be at least as free as lib_a's license.
        - You can incorporate permissive-libs into copyleft-libs, but not the other way around.
        - Aka. viral, aka. infectious. Nice.
    - your software may still be commercial, just not proprietary
    - can cause licensing conflicts
    - GPL, CC_BY_SA, IBM_public, Mozilla_public
    - FSF philosophy
    - Special case: GPL
        - viral clause only holds when you redistribute the lib
        - GPL2 not compatible with Apache2: GLP2 does not allow Apache's patent-clause
            - Even though its a good restriction, its a restriction... which GPL doesn't allow
        - GPL3 fixes the above point by also having patent-protection
        - LGPL: virality only applies to lib-code, not dependencies (I think?)


## Contributing to other people's libs
- Sometimes, project owners want to get your contribution's copyright transferred over to them
    - don't allow them except if you really trust the owner
- More commonly theres a CLA to handle contributions
- Even better: DCO (Developer's Certificate of Origin). Good, minimal hassle.

## Licenses - detailed
- https://opensource.org/licenses 
- https://ghinda.com/blog/opensource/2020/open-source-licenses-apache-mit-bsd.html#apache-license-20


## Special things

### Dual licensing
Sometimes software has two licenses.
 - Users: Most often users can pick the license they want to abide by. 
 - Coders: Most often contributed code must comply with both licenses.

### Contributor License Agreement (CLA)
Allows project leader to re-license the code
Also covers how other peoples' contributions are copyrighted



## Uncertainties
- Each country and court can decide individually if a given license is compatible with local laws: https://news.ycombinator.com/item?id=10455848