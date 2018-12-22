using System;
using System.Collections.Generic;
using System.Text;

namespace Shapes
{
    public class Circle : ShapeBase
    {
        public double Radius { get; private set; }

        public Circle(int radius)
        {
            Radius = radius;
        }

        public override double Area =>  Math.PI * (Radius * Radius);
    }
}
