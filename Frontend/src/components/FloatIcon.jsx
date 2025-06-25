const FloatingIcon = ({ icon, delay, x, y }) => (
    <div
      className="absolute text-4xl text-orange-500 opacity-10"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `iconFloat 8s ease-in-out infinite ${delay}s`,
      }}
    >
      {icon}
    </div>
  );


const Floating = () =>{
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingIcon icon="🏗️" delay={0} x={5} y={15} />
        <FloatingIcon icon="🏢" delay={2} x={90} y={10} />
        <FloatingIcon icon="⚒️" delay={4} x={10} y={80} />
        <FloatingIcon icon="🏭" delay={6} x={85} y={70} />
        <FloatingIcon icon="🔧" delay={1} x={45} y={5} />
        <FloatingIcon icon="⛑️" delay={3} x={95} y={45} />
        <FloatingIcon icon="🏠" delay={5} x={5} y={50} />
      </div>
    )
}
export default Floating;