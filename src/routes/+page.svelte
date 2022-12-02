<svelte:head>
	<title>PowerPlay Scoreboard</title>
	<meta name="description" content="better score-board for PowerPlay2022" />
</svelte:head>

<script lang="ts">
	import type {ConeAction} from "$lib/cone-action";
	import type {Pole} from "$lib/pole";
	import {PoleHeight} from "$lib/pole";
	import {Alliance, ConeType} from "../lib/cone";

	let junctions: Pole[][] = [
		[
			{height: PoleHeight.GROUND, coordinates: [0, 0], cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.LOW, coordinates: [0, 1], cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.GROUND, coordinates: [0, 2], cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.LOW, coordinates: [0, 3], cones: [], blueConeCount: 0, redConeCount: 0},
			{height: PoleHeight.GROUND, coordinates: [0, 4], cones: [], blueConeCount: 0, redConeCount: 0},
		],
	];
	let actions: ConeAction[] = [];

	$: {
		console.log(actions);
	}

	function addConeToPole(xCoordinate: number, yCoordinate: number, color: Alliance): void {
		console.log("addConeToPole", xCoordinate, yCoordinate);
		// for trigger reactivity
		actions = [...actions, {
			cone: {
				category: ConeType.REGULAR,
				color: color,
				coordinates: [xCoordinate, yCoordinate],
			},
			pole: junctions[yCoordinate][xCoordinate],
		}];
	}

	function undoAction(): void {
		console.log("undoAction");
		actions = actions.slice(0, actions.length - 1);
	}
</script>

<section>
	{#each junctions as junctionRow, i}
		<div>
			<p>Row: {i}</p>
			{#each junctionRow as pole, j}
				<div class="pole">
					<p>
						{pole.coordinates[0]},{pole.coordinates[1]} {pole.height}
						<button on:click={() => addConeToPole(j ,i, Alliance.BLUE)}>Add Blue</button>
						<button on:click={() => addConeToPole(j ,i, Alliance.RED)}>Add Red</button>
					</p>
				</div>
			{/each}
		</div>
	{/each}

	<button on:click={undoAction}>Undo</button>
</section>
