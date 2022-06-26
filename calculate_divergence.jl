#I know this is incredibly simple, it will be updated
using Pkg
Pkg.add("Distances")
using Distances

ref = [1.3,1.2,1.1]
que = [1.5,1.2,1.6]

result = js_divergence( ref, que)
print(result)