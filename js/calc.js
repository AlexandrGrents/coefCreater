function calcCoefs (dots)
{
	let coefs = [];
	let a, b, c, d, e, f, g, h;
	if (dots.length == 4)
	{
	    let A = [];
	    let B = [0, 0, 0, 0, 0, 0, 0, 0];
	    coefs = slay(A, B);
	}
	else
	{

	}
	return coefs;
}

function slay(A, B) 
{
	let a;
	for (let k = 0; k < 8; k++)
	{
		a = A[k][k];
		for (let i = k+1; i<8; i++)
		{
			for (let j = k+1; j<8; j++) A[k][i] = A[i][j] - A[i][k] * A[k][j] / a; 
			B[i] = B[i] - B[k] * A[i][k] / a;
			A[i][k] = 0; 
		}
	}
	let X = new Array(8);
	let s;
	for (let k = 7; k>=0; k--)
	{
		s = 0;
		for (let j = k+1; j<8; j++)
		{
			s += A[k][j]*X[k];
		}
		X[k] = (B[k] - s) / A[k][k];
	}
	return X;
}